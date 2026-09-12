create policy "users upload their own loot proofs" on storage.objects for insert to authenticated with check (
  bucket_id = 'loot-proofs' and (storage.foldername(name))[1] = auth.uid()::text
);
create policy "users read their own loot proofs" on storage.objects for select to authenticated using (
  bucket_id = 'loot-proofs' and (storage.foldername(name))[1] = auth.uid()::text
);