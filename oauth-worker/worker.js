// Proxy OAuth GitHub untuk Decap CMS Haisumbar.com
// Deploy sebagai Cloudflare Worker, lalu isi dua variabel di dashboard Worker:
//   OAUTH_GITHUB_CLIENT_ID     = Client ID dari GitHub OAuth App
//   OAUTH_GITHUB_CLIENT_SECRET = Client Secret dari GitHub OAuth App (RAHASIA — hanya di dashboard Cloudflare)
// Langkah lengkap: lihat README.md di folder ini.

function halamanHasil(status, content) {
  var pesan = 'authorization:github:' + status + ':' + JSON.stringify(content);
  return new Response(
    '<!doctype html><html><body><script>' +
    'var receiveMessage = function (e) {' +
    '  window.opener.postMessage(' + JSON.stringify(pesan) + ', e.origin);' +
    '  window.removeEventListener("message", receiveMessage, false);' +
    '};' +
    'window.addEventListener("message", receiveMessage, false);' +
    'window.opener.postMessage("authorizing:github", "*");' +
    '</script><p>Memproses login… jendela ini tertutup otomatis.</p></body></html>',
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}

export default {
  async fetch(request, env) {
    var url = new URL(request.url);

    if (url.pathname === '/auth') {
      var params = new URLSearchParams({
        client_id: env.OAUTH_GITHUB_CLIENT_ID,
        scope: 'repo,user'
      });
      return Response.redirect('https://github.com/login/oauth/authorize?' + params.toString(), 302);
    }

    if (url.pathname === '/callback') {
      var code = url.searchParams.get('code');
      if (!code) return halamanHasil('error', { message: 'Kode OAuth tidak ada' });
      var res = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          client_id: env.OAUTH_GITHUB_CLIENT_ID,
          client_secret: env.OAUTH_GITHUB_CLIENT_SECRET,
          code: code
        })
      });
      var data = await res.json();
      if (data.access_token) {
        return halamanHasil('success', { token: data.access_token, provider: 'github' });
      }
      return halamanHasil('error', { message: data.error_description || 'Login GitHub gagal' });
    }

    return new Response('Proxy OAuth Decap CMS — Haisumbar.com. Titik masuk: /auth', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
};
