import hashlib
import random
import time
import datetime
import uuid
import string
import base64

from cryptography import x509
from cryptography.hazmat.primitives.serialization import Encoding,PublicFormat
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.serialization.pkcs7 import load_pem_pkcs7_certificates
from cryptography.hazmat.primitives.padding import PKCS7

class SMSDK:

    def __init__(self):
        # 获取配置信息
        self.cloud_config_md5 = self.get_cloudconf_md5()
        self.public_key = self.get_public_key()
        self.fingerprint_json = self.get_fingerprint_json()

    def get_fingerprint_json(self):
        f = open('assets/fingerprint.json', 'rb')
        data = f.read()
        f.close()
        return data[:-1].decode('utf-8')


    def get_cloudconf_md5(self):
        file = "./assets/cloudconf.json"
        f = open(file, 'rb')
        self.cloud_config = f.read()
        f.close()
        md5 = hashlib.md5()
        md5.update(self.cloud_config[:-1])
        return md5.hexdigest()

    def get_public_key(self):
        cert_path = "./assets/cert.pem"
        f = open(cert_path, 'rb');
        data = f.read()
        f.close()
        cert = x509.load_pem_x509_certificate(data)
        public_key = cert.public_key()
        return public_key

    def get_smid(self):
        '''
        s1 = "%04d%02d%02d%02d%02d%02d"格式的时间
        s2 = "/proc/sys/kernel/random/uuid"得到的uuid以0x40大小求md5
        s3 = md5("shumei_android_sec_key_" + s1 + s2 + "00")
        s = s1 + s2 + "00" + s3[0:14]

        eg:
        s1 = "20240220151752"
        s2 = "1e3eb27ec0a2442fef427b6a2cce7730"
        '''

        date = datetime.datetime.now()
        s1 = "{:04d}{:02d}{:02d}{:02d}{:02d}{:02d}".format(date.year,date.month,date.month,date.hour,date.minute,date.second)

        md5 = hashlib.md5()
        uuid_str = str(uuid.uuid4()) + '\n'
        s2_byte_array = bytearray(0x40)
        for i,ch in enumerate(bytes(uuid_str, 'utf-8')):
            s2_byte_array[i] = ch
        md5.update(s2_byte_array)
        s2 = md5.hexdigest()

        data = "shumei_android_sec_key_" + s1 + s2 + "00"

        md5.update(data.encode('utf-8'))
        s3 = md5.hexdigest();

        s = s1 + s2 + "00" + s3[0:14]
        return s

    def sdk_version(self):
        return "2.9.8"

    def get_md5(self):
        '''
        获取配置信息的md5
        '''
        return self.cloud_config_md5

    def get_sid(self):
        '''
        String.format(Locale.CHINA, "%d-%05d", Long.valueOf(System.currentTimeMillis()), Integer.valueOf(new Random().nextInt(100000)));
        '''
        timestamp = int(time.time() * 1000)
        r = random.randint(0, 100000)
        s = "{:d}-{:05d}".format(timestamp, r);
        return s


    def get_pri(self, key):
        '''
        s1 = 随即生成16字符长度的，由a-z组成的字符串
        s2 = s1公钥加密
        s3 = base64(s2)
        '''
        ciphertext = self.public_key.encrypt(
            key.encode('utf-8'),
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )

        pri = base64.b64encode(ciphertext).decode('utf-8')
        return pri

    def get_fingerprint(self, key:str):
        '''
        s1 = pri生成的key取md5
        iv = 0102030405060708
        s2 = aes(s1, iv)
        s = base64(s2)
        '''
        data = self.fingerprint_json.encode('utf-8')

        md5 = hashlib.md5()
        md5.update(key.encode('utf-8'));
        s1 = md5.hexdigest()
        iv = '0102030405060708'

        padder = PKCS7(128).padder()
        padded_data = padder.update(data)
        padded_data += padder.finalize()
        
        cipher = Cipher(algorithms.AES(s1.encode('utf-8')), modes.CBC(iv.encode('utf-8')))
        encryptor = cipher.encryptor()
        s2 = encryptor.update(padded_data) + encryptor.finalize()

        return base64.b64encode(s2).decode('utf-8')

    def get_sessionId(self):
        timestamp = int(time.time() * 1000)
        return "{:d}".format(timestamp)

    def get_tn(self,sessionid,fingerprint_json,key,organization):
        '''
        s1 = sessionid + fingerprint_json + key + organization + "sm_tn"
        s2 = md5(s1)
        s = 公钥加密s2
        '''
        s1 = sessionid + fingerprint_json + key + organization + "sm_tn"

        md5 = hashlib.md5()
        md5.update(s1.encode('utf-8'))
        s2 = md5.hexdigest()

        ciphertext = self.public_key.encrypt(
            s2.encode('utf-8'),
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )

        tn = base64.b64encode(ciphertext)
        s = tn.decode('utf-8')
        return s
