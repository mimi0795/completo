export const QR_SAIDA_TOKEN =
  '555';

export function isQrSaidaValido(
  decodedText: string
) {
  const texto = decodedText.trim();

  if (texto === QR_SAIDA_TOKEN) {
    return true;
  }

  try {
    const url = new URL(texto);

    return (
      url.pathname === '/solicitar-saida' &&
      url.searchParams.get('qr') ===
        QR_SAIDA_TOKEN
    );
  } catch {
    return false;
  }
}
