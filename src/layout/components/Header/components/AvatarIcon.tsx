import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Menu, Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import { HOME_URL } from "../../../../config/config";
import avatar from "./../../../../assets/avatar.svg";

const AvatarIcon = (props: any) => {
  const { setToken } = props;
  const navigate = useNavigate();

  // 退出登录
  const logout = () => {
    Modal.confirm({
      title: "温馨提示",
      icon: <ExclamationCircleOutlined />,
      content: "是否确认退出登录？",
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        // setToken("");
        message.success("退出登录成功！");
        // navigate("/login");
      },
    });
  };

  // Dropdown Menu
  const menu = (
    <Menu
      items={[
        {
          key: "1",
          label: <span className="dropdown-item">首页</span>,
          onClick: () => navigate(HOME_URL),
        },
        {
          key: "2",
          label: <span className="dropdown-item">个人信息</span>,
          onClick: () => {},
        },
        {
          key: "3",
          label: <span className="dropdown-item">修改密码</span>,
          onClick: () => {},
        },
        {
          type: "divider",
        },
        {
          key: "4",
          label: <span className="dropdown-item">退出登录</span>,
          onClick: logout,
        },
      ]}
    ></Menu>
  );
  return (
    <>
      <Dropdown overlay={menu} placement="bottom" arrow trigger={["click"]}>
        <Avatar size="large" src={avatar} />
      </Dropdown>
    </>
  );
};

export default AvatarIcon;
