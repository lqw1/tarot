import { Breadcrumb } from "antd";
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { HOME_URL } from "../../../../config/config";
import { breadcrumbState } from "../../../../store";

const BreadcrumbNav = (props: any) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [breadcrumbMaps, setBreadcrumbMaps] = useRecoilState(breadcrumbState);
  const breadcrumbList = breadcrumbMaps[pathname] || [];
  const navigateTo = useCallback(() => {
    navigate(HOME_URL);
  }, []);

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item href="javascript:;" onClick={navigateTo}>
          首页
        </Breadcrumb.Item>
        {breadcrumbList.map((item: string) => {
          return (
            <Breadcrumb.Item key={item}>
              {item !== "首页" ? item : null}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
    </>
  );
};

export default BreadcrumbNav;
