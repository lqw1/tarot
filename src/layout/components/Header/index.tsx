import { LeftOutlined } from "@ant-design/icons";
import { Layout } from "antd";
import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AppHeader: React.FC = () => {
  const { Header } = Layout;
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = useMemo(() => location.pathname === 'home', [location])
  return (
    <Header>
      {!isHome && <LeftOutlined onClick={() => navigate(-1)} />}
      <h2>tarot</h2>
    </Header>
  );
};

export default AppHeader;
