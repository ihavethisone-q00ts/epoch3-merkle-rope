type CardProps = {
  name: string;
  children?: React.ReactNode;
};

export const Card = ({ name, children }: CardProps): JSX.Element => {
  return (
    <section className="flex flex-col justify-center rounded border-2 border-gray-500 p-6 shadow-xl duration-500 motion-safe:hover:scale-105">
      <h2 className="text-lg text-gray-700">{name}</h2>
      <div className="text-sm text-gray-600">{children}</div>
    </section>
  );
};
