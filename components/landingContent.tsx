import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const testimonialsData = [
  {
    name: "shofikul islam",
    avatar: "S",
    title: "Full stack developer",
    description: "This is best practice with AI",
  },
  {
    name: "shofikul islam",
    avatar: "S",
    title: "Full stack developer",
    description: "This is best practice with AI",
  },
  {
    name: "shofikul islam",
    avatar: "S",
    title: "Full stack developer",
    description: "This is best practice with AI",
  },
  {
    name: "shofikul islam",
    avatar: "S",
    title: "Full stack developer",
    description: "This is best practice with AI",
  },
  {
    name: "shofikul islam",
    avatar: "S",
    title: "Full stack developer",
    description: "This is best practice with AI",
  },
  {
    name: "shofikul islam",
    avatar: "S",
    title: "Full stack developer",
    description: "This is best practice with AI",
  },
  {
    name: "shofikul islam",
    avatar: "S",
    title: "Full stack developer",
    description: "This is best practice with AI",
  },
];
const LandingContent = () => {
  return (
    <div className="px-10 pb-20">
      <h1 className="font-extrabold text-white text-center text-4xl mb-10 ">
        Testimonials
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {testimonialsData.map((item, index) => (
          <Card key={index} className="bg-[#192339] text-white border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-x-4">
                <div>
                  <p>{item.name}</p>
                  <p className="text-sm text-zinc-400">{item.title}</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-1">{item.description}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LandingContent;
