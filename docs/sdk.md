# Javascript SDK

SDK kullanarak tarayıcı üzerinden veri gönderilebilir. SDK header bilgilerinin yönetimini otomatik olarak yapar.

> Veri formatını ve arkaplanda yapılacak sorgu hakkında daha ayrıntılı bilgi için [sunucu](server.md) dokümanını inceleyin.

## Kurulum

```html
<script>
  // ambarAsyncInit() fonksiyonu SDK'nın yüklenmesi
  // ardından otomatik olarak çağırılır.
  window.ambarAsyncInit = function() {
    Ambar.init({
      appId : 'AMBAR_APP_ID', // Zorunlu
      userId: 'USER_ID'       // Zorunlu değildir. Daha sonradan Ambar.setUserId() ile atanabilir.
    });
  };

  (function (d, s, id) {
    var js, sdkjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = 'https://ambar.garajsepeti.com/sdk.js';
    sdkjs.parentNode.insertBefore(js, sdkjs);
  }(document, 'script', 'ambar-sdk'));
</script>
```

## Kullanım

Kurulum ardından aşağıdaki gibi veri gönderilebilir:

```js
Ambar.logEvent('listing_seller_phone_view', {
  listing_id: 1101734,
  medium: 'listing_detail'
});
```

## Geliştirme

SDK build edilirken `API_URL` ortam değişkeni kullanılır. Varsayılan olarak canlı ortama işaret edildiği için geliştirme ortamında değiştirilmesi tavsiye edilir.

Proje dizininde `.env` dosyası oluşturup lokal sunucu bilgisi aşağıdaki gibi atanabilir:

```
API_URL=http://localhost:4000
```

Daha sonra da dosya değişimlerini izleyerek SDK'yı yeniden build eden proses başlatılabilir.

```bash
$ yarn && yarn watch
```
