import heroPlaceholder from '../assets/inner-about.jpeg';
import serviceCardPlaceholder from '../assets/about-image.jpeg';
import serviceInnerPlaceholder from '../assets/inner-about.jpeg';
import partnerLogoPlaceholder from '../assets/logo-su.jpeg';
import coursePlaceholder from '../assets/bls.jpeg';
import certificationPlaceholder from '../assets/nebosh.jpeg';

// Default schemas for API responses live here and are used by normalize helpers below.
// These match the current API shape (same keys, same nesting) and only fill missing values.
const DEFAULTS = {
  heroSlides: [
    {
      _id: 'dummy-hero-slide',
      id: 'dummy-hero-slide',
      type: 'image',
      label: 'Healthcare Training',
      title: 'Elevate your medical skills',
      subtitle: 'Hands-on learning with certified instructors.',
      mediaUrl: heroPlaceholder,
      buttonText: 'View Courses →',
      buttonLink: '/courses',
      secondaryButtonText: 'Contact Us',
      secondaryButtonLink: '/contact',
      order: 0,
      isActive: true,
      createdAt: '',
      updatedAt: '',
    },
  ],
  services: [
    {
      _id: 'dummy-service',
      id: 'dummy-service',
      title: 'Clinical Training',
      shortDescription: 'Hands-on training designed for real-world practice.',
      description: 'Comprehensive medical training programs led by experts.',
      slug: 'clinical-training',
      imageUrl: serviceCardPlaceholder,
      innerImageUrl: serviceInnerPlaceholder,
      sortOrder: 0,
      isActive: true,
      createdAt: '',
      updatedAt: '',
    },
  ],
  partners: [
    {
      _id: 'dummy-partner',
      id: 'dummy-partner',
      name: 'Medical Partner',
      logoUrl: partnerLogoPlaceholder,
      link: 'https://example.com',
      sortOrder: 0,
      isActive: true,
      createdAt: '',
      updatedAt: '',
    },
  ],
  courses: [
    {
      _id: 'dummy-course',
      id: 'dummy-course',
      title: 'Advanced Life Support',
      slug: 'advanced-life-support',
      shortDescription: 'Build critical response skills with certified training.',
      description: 'A full course covering emergency response protocols.',
      imageUrl: coursePlaceholder,
      cardBody: 'Professional, accredited medical course.',
      duration: '2 Days',
      sortOrder: 0,
      isActive: true,
      createdAt: '',
      updatedAt: '',
    },
  ],
  certifications: [
    {
      _id: 'dummy-certification',
      id: 'dummy-certification',
      title: 'Professional Certification',
      slug: 'professional-certification',
      shortDescription: 'Industry-recognized accreditation program.',
      description: 'Gain the certification needed to advance your career.',
      issuer: 'SAUDI-CANADIAN TRAINING & SIMULATION CENTER',
      validityDate: '',
      issuedDate: '',
      benefits: [
        'Recognized credential to advance your career.',
        'Practical, hands-on training with expert instructors.',
        'Updated curriculum aligned with industry standards.',
      ],
      cardImageUrl: certificationPlaceholder,
      heroImageUrl: certificationPlaceholder,
      innerImageUrl: certificationPlaceholder,
      heroSubtitle: 'Advance your professional credentials.',
      sortOrder: 0,
      isActive: true,
      createdAt: '',
      updatedAt: '',
    },
  ],
};

const isObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const isEmptyString = (value) => typeof value === 'string' && value.trim() === '';

// Missing/empty detection: null, undefined, empty string, or empty array.
const isMissingValue = (value) => {
  if (value === null || value === undefined) return true;
  if (isEmptyString(value)) return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
};

const deepClone = (value) => {
  if (Array.isArray(value)) return value.map((item) => deepClone(item));
  if (isObject(value)) {
    const cloned = {};
    Object.keys(value).forEach((key) => {
      cloned[key] = deepClone(value[key]);
    });
    return cloned;
  }
  return value;
};

const mergeWithDefaults = (value, defaults) => {
  if (Array.isArray(defaults)) {
    const itemDefaults = defaults[0];
    if (!Array.isArray(value) || value.length === 0) {
      return defaults.map((item) => deepClone(item));
    }
    if (!itemDefaults) {
      return value;
    }
    return value.map((item) => mergeWithDefaults(item, itemDefaults));
  }

  if (isObject(defaults)) {
    const source = isObject(value) ? value : {};
    const result = {};

    Object.keys(defaults).forEach((key) => {
      result[key] = mergeWithDefaults(source[key], defaults[key]);
    });

    Object.keys(source).forEach((key) => {
      if (!(key in result)) {
        result[key] = source[key];
      }
    });

    return result;
  }

  if (isMissingValue(value)) {
    return defaults;
  }

  return value;
};

// API data is fetched in the api layer (src/api/* and src/services/*) then normalized here.
// Static images are injected via the placeholder imports above when API media fields are missing.
export function applyDefaults(apiData, defaultsSchema) {
  return mergeWithDefaults(apiData, defaultsSchema);
}

export function normalizeHeroSlides(apiData) {
  return mergeWithDefaults(apiData, DEFAULTS.heroSlides);
}

export function normalizeServices(apiData) {
  return mergeWithDefaults(apiData, DEFAULTS.services);
}

export function normalizeService(apiData) {
  return mergeWithDefaults(apiData, DEFAULTS.services[0]);
}

export function normalizePartners(apiData) {
  return mergeWithDefaults(apiData, DEFAULTS.partners);
}

export function normalizeCourses(apiData) {
  return mergeWithDefaults(apiData, DEFAULTS.courses);
}

export function normalizeCourse(apiData) {
  return mergeWithDefaults(apiData, DEFAULTS.courses[0]);
}

export function normalizeCertifications(apiData) {
  return mergeWithDefaults(apiData, DEFAULTS.certifications);
}

export function normalizeCertification(apiData) {
  return mergeWithDefaults(apiData, DEFAULTS.certifications[0]);
}
