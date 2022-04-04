import { FunctionComponent } from "react";

const Nav: FunctionComponent = () => {
  return (
    <div className="nav">
      <div className="nav-collection">
        <div className="nav-item">Home</div>
        <div className="nav-item">Courses</div>
        <div className="nav-item">Professors</div>
      </div>
      <div className="nav-collection">
        <div className="nav-item">View Source</div>
      </div>
    </div>
  );
};
export default Nav;
