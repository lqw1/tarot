import { ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import Router from "./routers";
import AuthRouter from "./routers/utils/authRouter";

const App = (props) => {
  const { language, setLanguage } = props;
  const [i18nLocale, setI18nLocale] = useState(zhCN);

  useEffect(() => {}, []);

  return (
    <BrowserRouter basename="/tarot">
      <ConfigProvider locale={i18nLocale}>
        <AuthRouter>
          <Router />
        </AuthRouter>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;
