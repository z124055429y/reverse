import hashlib
import random
import time
import datetime
import uuid

class SMSDK:

    def __init__(self):
        # 获取配置信息
        file = "./assets/cloudconf.json"
        f = open(file, 'rb')
        self.cloud_config = f.read()
        f.close()
        md5 = hashlib.md5()
        md5.update(self.cloud_config[:-1])
        self.cloud_config_md5 = md5.hexdigest()

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



