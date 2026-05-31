export const QR_SAIDA_TOKEN =
  'MIRIAA_SOLICITAR_SAIDA_UNICO_2026';

const QR_SAIDA_TOKENS_VALIDOS = [
  QR_SAIDA_TOKEN,
  '555'
];

export function isQrSaidaTokenValido(
  token: string | null
) {
  return !!token &&
    QR_SAIDA_TOKENS_VALIDOS.includes(token);
}

function isRotaSolicitarSaida(
  pathname: string
) {
  return [
    '/solicitar-saida',
    '/solicita-saida'
  ].includes(pathname);
}

export function isQrSaidaValido(
  decodedText: string
) {
  const texto = decodedText.trim();

  if (isQrSaidaTokenValido(texto)) {
    return true;
  }

  try {
    const url = new URL(texto);
    const hashPath =
      url.hash.startsWith('#/')
        ? url.hash.slice(1).split('?')[0]
        : '';

    const hashSearch =
      url.hash.includes('?')
        ? url.hash.slice(url.hash.indexOf('?'))
        : '';

    const token =
      url.searchParams.get('qr') ||
      new URLSearchParams(hashSearch).get('qr');

    return (
      (
        isRotaSolicitarSaida(url.pathname) ||
        isRotaSolicitarSaida(hashPath)
      ) &&
      isQrSaidaTokenValido(token)
    );
  } catch {
    return false;
  }
}
