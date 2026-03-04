// src/utils/seoHelpers.ts
export const setSeoData = ({
    meta_title,
    meta_description,
    meta_keywords,
    og_image,
    canonical_url
}: {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    og_image?: string;
    canonical_url?: string;
}) => {
    if (meta_title) {
        document.title = meta_title;
        updateMeta('og:title', meta_title, true);
    }

    if (meta_description) {
        updateMeta('description', meta_description);
        updateMeta('og:description', meta_description, true);
    }

    if (meta_keywords) {
        updateMeta('keywords', meta_keywords);
    }

    if (og_image) {
        updateMeta('og:image', og_image, true);
    }

    if (canonical_url) {
        let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
        if (!link) {
            link = document.createElement('link');
            link.setAttribute('rel', 'canonical');
            document.head.appendChild(link);
        }
        link.setAttribute('href', canonical_url);
    }
};

const updateMeta = (name: string, content: string, isProperty = false) => {
    if (!content) return;
    const attr = isProperty ? 'property' : 'name';
    let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
};
