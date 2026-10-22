-- Enable required extensions for AI image validation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add AI validation columns to loot_claims table
ALTER TABLE loot_claims 
ADD COLUMN IF NOT EXISTS ai_validation_result TEXT,
ADD COLUMN IF NOT EXISTS ai_confidence_score FLOAT,
ADD COLUMN IF NOT EXISTS ai_validation_timestamp TIMESTAMPTZ;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_loot_claims_user_id_status 
ON loot_claims(user_id, status);

CREATE INDEX IF NOT EXISTS idx_loot_claims_created_at 
ON loot_claims(created_at DESC);

-- Add storage bucket configuration comments (if needed in backend)
COMMENT ON TABLE loot_claims IS 'Stores user loot claims with AI-verified photo proofs';
COMMENT ON COLUMN loot_claims.photo_path IS 'Stored path to image proof (e.g., {user_id}/{uuid}.{ext})';
COMMENT ON COLUMN loot_claims.ai_validation_result IS 'AI validation result: "approved" | "rejected" | "pending"';
COMMENT ON COLUMN loot_claims.ai_confidence_score IS 'AI confidence score (0-1) for photo-loot match';

-- Create RLS policies if they don't exist yet
DO $$
BEGIN
  -- Enable RLS on loot_claims
  ALTER TABLE loot_claims ENABLE ROW LEVEL SECURITY;
  
  -- Drop existing policies if any
  DROP POLICY IF EXISTS "UsersCanViewOwnClaims" ON loot_claims;
  DROP POLICY IF EXISTS "UsersCanInsertOwnClaims" ON loot_claims;
  DROP POLICY IF EXISTS "AdminsCanViewAllClaims" ON loot_claims;
  
  -- Policy: Users can view their own claims
  CREATE POLICY "UsersCanViewOwnClaims" ON loot_claims
    FOR SELECT USING (auth.uid() = user_id);
  
  -- Policy: Users can insert their own claims
  CREATE POLICY "UsersCanInsertOwnClaims" ON loot_claims
    FOR INSERT WITH CHECK (auth.uid() = user_id);
  
  -- Policy: No one can update/delete directly (handled by server functions)
  CREATE POLICY "OnlyAdminsModifyClaims" ON loot_claims
    FOR ALL USING (false);
END $$;

-- Create RLS policy for storage bucket access
DO $$
BEGIN
  ALTER TABLE public.storage ENABLE ROW LEVEL SECURITY IF EXISTS;
  
  DROP POLICY IF EXISTS "UsersCanViewOwnProofs" ON storage;
  DROP POLICY IF EXISTS "UsersCanUploadOwnProofs" ON storage;
  DROP POLICY IF EXISTS "AdminsFullStorageAccess" ON storage;
  
  -- Users can only view their own proofs
  CREATE POLICY "UsersCanViewOwnProofs" ON storage
    FOR SELECT USING (bucket_id = 'loot-proofs' AND auth.uid() LIKE '%' || photo_path::text);
  
  -- Users can only upload to their own folder
  CREATE POLICY "UsersCanUploadOwnProofs" ON storage
    FOR INSERT WITH CHECK (bucket_id = 'loot-proofs' AND auth.uid() LIKE '%' || name || '/%');
END $$;

-- Create function for AI validation (stub - will be implemented with actual AI service)
CREATE OR REPLACE FUNCTION verify_claim_ai(photo_path TEXT, loot_prompt TEXT)
RETURNS JSON AS $$
DECLARE
  result TEXT;
  confidence FLOAT;
BEGIN
  -- Placeholder for AI image validation logic
  -- In production, this would call:
  -- 1. AWS Rekognition / Google Vision / Azure Computer Vision API
  -- 2. Custom vision model trained on loot types
  -- 3. Or a server-side function that processes the uploaded image
  
  RETURN JSON_BUILD_OBJECT(
    'result', 'pending',
    'confidence', NULL,
    'timestamp', NOW(),
    'method', 'ai_validation_stub',
    'photo_path', photo_path,
    'loot_prompt', loot_prompt
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN JSON_BUILD_OBJECT(
      'result', 'error',
      'confidence', NULL,
      'timestamp', NOW(),
      'error_message', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users for AI validation
GRANT EXECUTE ON FUNCTION verify_claim_ai(TEXT, TEXT) TO authenticated;

-- Create function for auto-approving claims (for testing/fallback)
CREATE OR REPLACE FUNCTION auto_approve_pending_claims()
RETURNS VOID AS $$
BEGIN
  -- Auto-approve pending claims from today (no AI validation yet)
  UPDATE loot_claims
  SET 
    status = 'approved',
    ai_validation_result = 'auto_approved_no_ai',
    ai_confidence_score = 1.0,
    ai_validation_timestamp = NOW()
  WHERE status = 'pending'
    AND EXTRACT(YOURDATE FROM created_at) = YOURDATE(NOW());
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Auto-approve failed: ', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute on auto-approve function
GRANT EXECUTE ON FUNCTION auto_approve_pending_claims() TO authenticated;

COMMENT ON FUNCTION auto_approve_pending_claims IS 'Auto-approves all pending claims from today (fallback without AI validation)';
