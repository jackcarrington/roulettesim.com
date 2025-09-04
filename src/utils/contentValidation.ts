import type { CollectionEntry } from 'astro:content';

type EducationalContent = CollectionEntry<'educational'>;

export interface ContentValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateEducationalContent(content: EducationalContent): ContentValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // YMYL Content Quality Standards
  const { data, body } = content;
  
  // Required author credentials for YMYL content
  if (!data.authorCredentials || !data.authorCredentials.name) {
    errors.push('Author credentials required for YMYL content');
  }
  
  if (!data.authorCredentials?.credentials || data.authorCredentials.credentials.length === 0) {
    errors.push('Author credentials must include qualifications');
  }
  
  // Content completeness validation
  if (!data.title || data.title.length < 10) {
    errors.push('Title must be at least 10 characters for SEO');
  }
  
  if (!data.description || data.description.length < 120) {
    errors.push('Description must be at least 120 characters for SEO');
  }
  
  if (!body || body.trim().length < 500) {
    errors.push('Educational content must be at least 500 characters');
  }
  
  // Responsible gambling validation
  if (!data.responsibleGambling) {
    warnings.push('Responsible gambling messaging should be enabled');
  }
  
  // Reading time estimation
  if (!data.readingTime || data.readingTime < 2) {
    warnings.push('Educational content should have minimum 2-minute reading time');
  }
  
  // SEO keyword validation
  if (!data.seoKeywords || data.seoKeywords.length < 3) {
    warnings.push('Recommend at least 3 SEO keywords for content discovery');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function validateContentBeforePublication(content: EducationalContent): boolean {
  const validation = validateEducationalContent(content);
  
  if (!validation.isValid) {
    console.error('Content validation failed:', validation.errors);
    return false;
  }
  
  if (validation.warnings.length > 0) {
    console.warn('Content validation warnings:', validation.warnings);
  }
  
  return true;
}