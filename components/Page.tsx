import Link from "next/link";
import { useRouter } from "next/router";
import React, { FunctionComponent } from "react";

interface PageProps {
  title: string;
}
const Page: FunctionComponent<PageProps> = ({ title, children }) => {
  const router = useRouter();
  return (
    <div className="page-container">
      <div style={{ flex: 1 }}></div>
      <div className="page">
        <div className="hbox">
          <Link href="/">Home</Link>
          <div className="mx-1"></div>
          <Link href="/dashboard">Dashboard</Link>
        </div>
        <h1>{title}</h1>
        <hr />
        <div>{children}</div>
      </div>
      <div style={{ flex: 1 }}></div>
    </div>
  );
};

export default Page;
