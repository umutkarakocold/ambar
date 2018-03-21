# Sunucu

Datastore ve veriyi gönderen kaynak arasında ince bir katman olarak durur. Verileri HTTP üzerinden kabul eder. Gelen sorgu için kaynak doğrulaması yapar, HTTP header'lar ile belirtilen üst bilgiler eşliğinde zenginleştirilir ve son olarak veri Datastore'a gönderir.

## Doğrulama

Ambar'a sadece doğrulanmış kaynaklar üzerinden veri gönderilebilir. Gönderim yapacak bir servis Datastore'da `App` olarak kaydedilmelidir. Bir `App` aşağıdaki alanlardan oluşur.

| Alan    | Örnek                 | Açıklama                                                                                                                    |
| ------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| id      | 6282328254971904      | Datastore key formatı                                                                                                       |
| name    | Hürriyet Oto          | Kaynak adı                                                                                                                  |
| code    | ho                    | İki haneli kısaltma. Veriler yazılırken bu kod veriye de eklenmektedir.                                                     |
| domains | ["*.hurriyetoto.com"] | Gönderime izin verilen domain'ler. Gönderimin yapıldığı domain [micromatch#any](http://bit.ly/2EmqIws) ile karşılaştırılır. |

## Zenginleştirme

Gönderilen bilgiler değerlendirilerek, veri kaydedilmeden önce zenginleştirilir. Örneğin `User-Agent` ile kullanıcının kullandığı işletim sistemi, cihaz gibi bilgiler tespit edilerek veriye eklenir.

`time_` öneki ile gönderilen alanlar otomatik olarak tarih formatına dönüştürülür. Bu alanların değerleri milisaniye formatında (Ör: [Date.now()](https://mzl.la/1MOTt3N)) olmalıdır.

## Kaydetme

Veri Datastore'a yazılırken üst bilgi olarak alınan ya da zenginleştirme ile oluşan bilgiler için önek olarak `_` kullanılır. Örneğin `User-Agent` üzerinden oluşturulan bilgi `_technology` alanı olarak kaydedilir.

## Örnek Sorgu

```http
POST /events HTTP/1.1
Host: ambar.garajsepeti.com
Content-Type: application/json
X-Ambar-App-ID: 6282328254971904
X-Ambar-User-ID: 231
X-Ambar-Device-ID: FwDkc
X-Ambar-Session-ID: Om5h2
X-Ambar-Timestamp: 1517301688022

{
  "name": "listing_seller_phone_view",
  "props": {
    "listing_id": 1101734,
    "medium": "listing_detail"
  }
}
```

## Parametreler

### Header

| İsim               | Zorunlu | Açıklama                                                                                                                                                                         |
| ------------------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| X-Ambar-App-ID     | ✓       | Veriyi gönderen servise ait uygulama ID                                                                                                                                          |
| X-Ambar-User-ID    |         | Serviste giriş yapmış kullanıcının ID'si                                                                                                                                         |
| X-Ambar-Device-ID  |         | Veriyi gönderen istemciye ait ayırt edici bilgi. Giriş yapılmaması durumunda verileri gruplamak amaçlıdır.                                                                       |
| X-Ambar-Session-ID |         | Kullanıcının o anki oturumuna ait ayırt edici bilgi. Aynı oturum süresince gönderilen verileri gruplamak amaçlıdır.                                                              |
| X-Ambar-Timestamp  | ✓       | Unix timestamp benzeri zaman bilgisi, ([saniye değil milisaniye!](http://bit.ly/2rRDKzt)).                                                                                       |
| X-Ambar-IP         |         | Kullanıcının IP adresi. Gönderilmemesi durumunda gönderimi yapan istemcinin IP adresi dikkate alınır. Bu bilgi lokasyon (ülke,şehir) [tespiti](http://bit.ly/2qVZdBZ) amaçlıdır. |
| User-Agent         |         | Kullanıcının tarayıcı bilgisi. Cihaz ve işletim sistesi gibi teknolojileri tespit amaçlıdır.                                                                                     |

### Body

| İsim  | Zorunlu | Açıklama                                                                                                    |
| ----- | ------- | ----------------------------------------------------------------------------------------------------------- |
| name  | ✓       | Gönderilen verinin tipi/kategorisi. Bu alan Datastore'da [kind](http://bit.ly/2DWLCoi) olarak kullanılıyor. |
| props |         | Veriye ait detay bilgi. Anahtar/değer formatında istenilen sayıda veri içerebilir.                          |

## Kurulum

Uygulama ortam değişkenleri ile yapılandırılır.

| İsim               | Varsayılan                    | Açıklama                                                                                         |
| ------------------ | ----------------------------- | ------------------------------------------------------------------------------------------------ |
| PORT               | 4000                          | Port numarası                                                                                    |
| API_URL            | https://ambar.garajsepeti.com | API adresi. SDK'nın build edilmesi sırasında kullanılır.                                         |
| GCLOUD_SERVICE_KEY |                               | Datastore bağlantısı için kullanılacak service account (JSON) bilgisinin base64 encoded hali.    |
| LOG_LEVEL          | info                          | Sunucu log seviyesi. Bunyan tarafından [kabul edilen](http://bit.ly/2np58iY) bir değer alabilir. |

Bu bilgiler proje dizininde `.env` dosyası oluşturularak sağlanabilir.

Aşağıdaki komut ile sunucu başlatılabilir:

```bash
$ yarn && yarn start
```

Geliştirme ortamı içinse aşağıdaki komut kullanılabilir:

```bash
$ yarn dev
```
