/**
 * Automatic SEO generation for products.
 * Uses OpenAI GPT-4o mini with smart template fallback.
 */

import { logger } from '../utils/logger.js';

interface ProductSEOInput {
  name: string;
  description: string;
  category: string;
  gender: string;
  badge?: string | null;
  price: number;
}

interface ProductSEOOutput {
  metaTitle: string;
  metaDescription: string;
  seoTags: string[];
}

const CATEGORY_LABELS: Record<string, string> = {
  camisetas: 'Camiseta',
  bone: 'Boné',
  moletom: 'Moletom',
  polo: 'Polo',
  infantil: 'Infantil',
  acessorios: 'Acessório',
};

function generateSEOFromTemplate(product: ProductSEOInput): ProductSEOOutput {
  const categoryLabel = CATEGORY_LABELS[product.category] ?? 'Peça';
  const genderLabel =
    product.gender === 'feminino'
      ? 'Feminina'
      : product.gender === 'masculino'
        ? 'Masculina'
        : '';

  const metaTitle = `${product.name} | BRAVOS BRASIL`.substring(0, 60).trim();

  const desc = product.description
    ? `${categoryLabel} patriótica ${genderLabel} - ${product.description}`
    : `${categoryLabel} patriótica ${genderLabel} ${product.name}. Qualidade premium, estampas exclusivas. Compre na BRAVOS BRASIL.`;
  const metaDescription = desc.substring(0, 160).trim();

  const seoTags = [
    'bravos brasil',
    'roupa patriótica',
    `${categoryLabel.toLowerCase()} patriótica`,
    'brasil',
    'patriotismo',
    product.category,
    product.gender !== 'unissex' ? product.gender : 'unissex',
    'deus pátria família',
  ]
    .filter(Boolean)
    .slice(0, 8);

  return { metaTitle, metaDescription, seoTags };
}

export async function generateProductSEO(
  product: ProductSEOInput,
): Promise<ProductSEOOutput> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    logger.warn('OPENAI_API_KEY not set — using template fallback for SEO generation.');
    return generateSEOFromTemplate(product);
  }

  try {
    const prompt = `Você é um especialista em SEO para e-commerce brasileiro de moda patriótica.

Gere SEO otimizado para este produto da marca BRAVOS BRASIL:
- Nome: ${product.name}
- Categoria: ${product.category}
- Gênero: ${product.gender}
- Preço: R$ ${product.price.toFixed(2)}
- Descrição: ${product.description}
${product.badge ? `- Badge: ${product.badge}` : ''}

O posicionamento da marca é: patriotismo brasileiro, fé cristã, tradição, valores conservadores, Deus, Pátria, Família. Estética sóbria e respeitosa.

Retorne APENAS um JSON válido (sem markdown, sem explicações) neste formato exato:
{
  "metaTitle": "título SEO com máximo 60 caracteres incluindo | BRAVOS BRASIL no final",
  "metaDescription": "descrição SEO com máximo 160 caracteres, inclua call-to-action e palavra-chave principal",
  "seoTags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8"]
}

Regras:
- metaTitle: máximo 60 caracteres, termine com " | BRAVOS BRASIL"
- metaDescription: máximo 160 caracteres, natural, persuasivo, inclua termo de busca principal
- seoTags: 6 a 8 tags em português, foco em termos que brasileiros buscam no Google`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };

    const content = data.choices[0]?.message?.content?.trim();
    if (!content) throw new Error('Empty OpenAI response');

    const parsed = JSON.parse(content) as ProductSEOOutput;
    const fallback = generateSEOFromTemplate(product);

    return {
      metaTitle: parsed.metaTitle?.substring(0, 60) ?? fallback.metaTitle,
      metaDescription:
        parsed.metaDescription?.substring(0, 160) ?? fallback.metaDescription,
      seoTags: Array.isArray(parsed.seoTags)
        ? parsed.seoTags.slice(0, 8)
        : fallback.seoTags,
    };
  } catch (error) {
    logger.error(`SEO generation via OpenAI failed, using fallback: ${error}`);
    return generateSEOFromTemplate(product);
  }
}
