import Card from "./context.js";

export default function Home() {
  return (
    <Card
      bgcolor="primary"
      txtcolor="white"
      header="BadBank Landing Module"
      title="Peter Demo Bank"
      text="Welcome to the Peter Demo Bank Capstone project.  You can move around using the navigation bar. 
      This is a single page application built with React to simulate an ATM application. 
      There is a MongoDB database and it was hosted with Heroku."
      body={<img src="/bank.jpeg" className="img-fluid" alt="Responsive" />}
    />
  );
}
