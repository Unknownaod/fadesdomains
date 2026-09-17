const DOMAIN_REGEX = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/;

export function cleanDomain(input) {
  if (typeof input !== 'string') return '';
  let value = input.trim().toLowerCase();
  if (!value) return '';
  value = value.replace(/^([a-z][a-z0-9+.-]*:)?\/\//, '');
  value = value.split(/[/?#]/)[0];
  value = value.replace(/^[^@]*@/, '');
  value = value.replace(/:\d+$/, '');
  value = value.replace(/^www\./, '');
  value = value.replace(/\.$/, '');
  return value;
}

export function isValidDomain(domain) {
  if (typeof domain !== 'string') return false;
  if (domain.length < 3 || domain.length > 253) return false;
  return DOMAIN_REGEX.test(domain);
}

export function isBareName(input) {
  const value = typeof input === 'string' ? input.trim().toLowerCase() : '';
  return /^[a-z0-9-]{1,63}$/.test(value);
}

export function formatPrice(price, currency = 'USD') {
  if (typeof price !== 'number') return '—';
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
  } catch {
    return `${currency} ${price.toFixed(2)}`;
  }
}
