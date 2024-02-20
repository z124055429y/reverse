import httpx

class V3CloudConfigRequest:
    def __init__(self, app, device, smsdk):
        self.app = app
        self.device = device
        self.smsdk = smsdk

    def request(self):
        url = 'http://fp-it.fengkongcloud.com/v3/cloudconf'
        headers = {
            "Content-Type": "application/octet-stream",
            "Connection": "Close",
            "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 9; Pixel 3 Build/PQ3A.190801.002)",
            "Host": "fp-it.fengkongcloud.com",
            "Accept-Encoding": "gzip",
        }
        json = {
            "data": {
                "smid": self.smsdk.get_smid(),
                "os": self.device.get_os(),
                "sdkver": self.smsdk.sdk_version(),
                "enc": 1,
                "md5": self.smsdk.get_md5(),
                "sid": self.smsdk.get_sid()
            },
            "organization": self.app.get_organization()
        }
        client = httpx.Client()
        response = client.post(url=url, headers=headers, json=json)
        return response
