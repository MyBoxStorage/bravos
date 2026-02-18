/**
 * Diagnostic script: identify products with blob: URLs in the database.
 * Run manually: tsx scripts/fix-blob-urls.ts
 *
 * Does NOT auto-fix — only reports which products need re-upload via admin.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function hasBlobUrl(value: unknown): boolean {
  if (typeof value === 'string') return value.startsWith('blob:');
  if (Array.isArray(value)) return value.some(hasBlobUrl);
  if (value && typeof value === 'object') return Object.values(value).some(hasBlobUrl);
  return false;
}

async function main() {
  console.log('🔍 Verificando produtos com blob URLs...\n');

  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, slug, image, images, color_stock');

  if (error) {
    console.error('❌ Erro ao buscar produtos:', error.message);
    process.exit(1);
  }

  const affected = products?.filter(
    (p) => hasBlobUrl(p.image) || hasBlobUrl(p.images) || hasBlobUrl(p.color_stock),
  ) ?? [];

  if (affected.length === 0) {
    console.log('✅ Nenhum produto com blob URLs encontrado.');
    return;
  }

  console.log(`⚠️  ${affected.length} produto(s) com blob URLs:\n`);
  for (const p of affected) {
    const fields: string[] = [];
    if (hasBlobUrl(p.image)) fields.push('image');
    if (hasBlobUrl(p.images)) fields.push('images');
    if (hasBlobUrl(p.color_stock)) fields.push('color_stock');

    console.log(`  ID:     ${p.id}`);
    console.log(`  Nome:   ${p.name}`);
    console.log(`  Slug:   ${p.slug}`);
    console.log(`  Campos: ${fields.join(', ')}`);
    console.log('');
  }

  console.log(
    '👉 Ação necessária: re-edite esses produtos no admin e faça upload das imagens novamente.',
  );
}

main().catch(console.error);
