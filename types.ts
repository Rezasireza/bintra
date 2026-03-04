export interface NavLink {
  label: string;
  href: string;
}

export interface Facility {
  title: string;
  description: string;
  iconName: string;
}

export interface Scholarship {
  title: string;
  description: string;
  highlight?: boolean;
}

export interface Testimonial {
  text: string;
  author: string;
  role: string;
}

export interface RegistrationStep {
  number: number;
  text: string;
}

export interface FeeItem {
  label: string;
  value: string;
  highlight?: boolean;
}