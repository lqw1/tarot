export class RegUtil {
  static userPswPattern =
    /^(?=.*\d)(?=.*[A-Z]{1,})(?=.*[a-z]{1,})(?=.*[!@#$%^&,.*]{1,})[^]{8,50}$/;
  static numberPattern = /^[+-]?\d+(\.\d+)?$/;
  static webAddrPattern =
    /^(http(s):\/\/.)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/g;
  static webWSAddrPattern = /(wss):\/\/\S*/;
  static ipAddrPattern =
    /^((\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/;
  static aliasNamePattern = /^[A-Za-z0-9_]+[^]{1,20}/;
  static eidPattern = /^[A-Za-z0-9]+[^]{0,15}/;
  static namePattern = /[<>]/;
  static positiveIntegerPattern = /^\+?[1-9][0-9]*$/;
  static englishNumberPatten = /^[A-Za-z0-9]+$/;
  static englishNumberDashPatten = /^[A-Za-z0-9-]+$/;
  static positiveNumberPattern = /^[+-]?(0\.[0-9]*|0|[1-9][0-9]*\.?[0-9]*)$/;
  static emailPattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  static ipWithPortPattern =
    /^((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))(:([0-9]|[1-9][0-9]|[1-9][0-9]{2}|[1-9][0-9]{3}|[1-5][0-9]{4}|6([0-4][0-9]{3}|5([0-4][0-9]{2}|5([0-2][0-9]|3[0-5])))))?$/;
  static inputTextPattern = /[<>&#]/g;
  static URLWithPortPattern = /^http(s|):\/\/\S+:\d+$/;

  static verifyPassword(password: string): boolean {
    return RegUtil.userPswPattern.test(password);
  }

  static verifyNumber(value: string): boolean {
    return RegUtil.numberPattern.test(value);
  }

  static verifyWebAddr(value: string): boolean {
    return RegUtil.webAddrPattern.test(value);
  }

  static verifyWebWsAddr(value: string): boolean {
    return RegUtil.webWSAddrPattern.test(value);
  }

  static verifyIpAddr(value: string): boolean {
    return RegUtil.ipAddrPattern.test(value);
  }

  static verifyAliasName(value: string): boolean {
    return RegUtil.aliasNamePattern.test(value);
  }

  static verifyEid(value: string): boolean {
    return RegUtil.eidPattern.test(value);
  }

  static verifyName(value: string): boolean {
    return !RegUtil.namePattern.test(value);
  }

  static verifyPositiveInt(value: string): boolean {
    return RegUtil.positiveIntegerPattern.test(`${value}`);
  }

  static verifyEnglishNumberPatten(value: string): boolean {
    return RegUtil.englishNumberPatten.test(value);
  }

  static verifyEnglishNumberDashPatten(value: string): boolean {
    return RegUtil.englishNumberDashPatten.test(value);
  }

  static verifyPositiveNumber(value: string): boolean {
    return RegUtil.positiveNumberPattern.test(value);
  }

  static verifyEmail(value: string): boolean {
    return RegUtil.emailPattern.test(value);
  }

  static verifyIpWithPort(value: string): boolean {
    return RegUtil.ipWithPortPattern.test(value);
  }

  static verifyURLWithPort(value: string): boolean {
    return RegUtil.URLWithPortPattern.test(value);
  }
}
