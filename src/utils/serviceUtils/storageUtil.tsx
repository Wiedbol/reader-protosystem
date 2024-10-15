class StorageUtil {
    //在浏览器的本地数据中获取键对应的值
    static getReaderConfig(key: string) {
        let readerConfig = JSON.parse(localStorage.getItem("readerConfig")! || '{}');
        return readerConfig[key];
    }
    
    static setReaderConfig(key: string, value: string) {
        let readerConfig = JSON.parse(localStorage.getItem("readerConfig")! || '{}');
        readerConfig[key] = value;
        localStorage.setItem("readerConfig", JSON.stringify(readerConfig));
    }

}

export default StorageUtil;