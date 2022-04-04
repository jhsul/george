import { FunctionComponent } from "react";

const Search: FunctionComponent = () => {
  return (
    <div className="search-container">
      <div className="search">
        <h1 className="display-2">GEORGE</h1>
        <p className="lead">Browse WPI student course reports 🎉</p>
        <div className="input-group">
          <input type="text" className="form-control" placeholder="george" />
          <div className="input-group-append">
            <button
              className="btn btn-primary"
              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
              type="button"
            >
              Search
            </button>
          </div>
        </div>
        <hr />
        <i>Made by Jack Sullivan for DS 509 / CS 586</i>
      </div>
    </div>
  );
};

export default Search;
