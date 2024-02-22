import httpx
import json
import string
import random

class V3ProfileAndroidRequest:
    def __init__(self, app, device, smsdk):
        self.app = app
        self.device = device
        self.smsdk = smsdk

    def request(self):
        url = 'http://fp-it.fengkongcloud.com/v3/profile/android'
        headers = {
            "Content-Type": "application/octet-stream",
            "Connection": "Close",
            "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 9; Pixel 3 Build/PQ3A.190801.002)",
            "Host": "fp-it.fengkongcloud.com",
            "Accept-Encoding": "gzip",
        }
        fingerprint_json = self.smsdk.get_fingerprint_json()
        sessionId = self.smsdk.get_sessionId()
        organization = self.app.get_organization()
        channel = self.app.get_channel()

        key = 'ggfaljxhaamqditi'
        length = 16
        letters = string.ascii_lowercase
        key = ''.join(random.choices(letters, k=length))

        pri = self.smsdk.get_pri(key)

        fingerprint = self.smsdk.get_fingerprint(key)

        tn = self.smsdk.get_tn(sessionId,fingerprint_json,key,organization)


        json_data = {
            "data": {
                "pri":pri,
                "fingerprint":fingerprint,
                "tn":tn,
                "sessionId":sessionId,
                "fpEncode":11
            },
            "encrypt":1,
            "organization": organization,
            "channel": channel
        }

        client = httpx.Client()
        response = client.post(url=url, headers=headers, json=json_data)
        return response

        pass
