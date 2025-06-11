import { Layout } from "antd";
import { Outlet, useLocation } from "react-router-dom";
// import AppHeader from "./components/Header";

import "./index.scss";

const { Header, Content, Sider } = Layout;

function LayoutIndex(props) {
  const { hideMenu, hideNav } = props;
  const location = useLocation();
  console.log(location)
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default LayoutIndex;
