import { FunctionComponent, useState } from "react";

interface CollapsibleProps {
  title: string;
}

const Collapsible: FunctionComponent<CollapsibleProps> = ({
  title,
  children,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <div>
      <hr />
      <h6
        style={{ cursor: "pointer" }}
        onClick={() => {
          setIsCollapsed((s) => !s);
        }}
      >
        {isCollapsed ? "+ " : "- "}
        {title}
      </h6>
      {!isCollapsed && <div className="questions-container">{children}</div>}
    </div>
  );
};

export default Collapsible;
