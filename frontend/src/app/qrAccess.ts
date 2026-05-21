export const QR_SAIDA_TOKEN =
  'MIRIAA_SOLICITAR_SAIDA_UNICO_2026';

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
