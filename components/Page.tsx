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
        <Link href="/">Home</Link>
        <h1>{title}</h1>
        <hr />
        <div>{children}</div>
      </div>
      <div style={{ flex: 1 }}></div>
    </div>
  );
};

export default Page;
