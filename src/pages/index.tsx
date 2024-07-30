import Image from "next/image";

export default function Home() {
  return (
    <>
    </>
  );
}

export const getServerSideProps = async ({ res }: any) => {
  res.setHeader('location', `/login`);
  res.statusCode = 308;
  res.end();
  return { props: {} };
};
