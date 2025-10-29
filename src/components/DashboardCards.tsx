import React from "react";
import Link from "next/link";

interface CardsProps {
  title: string;
  link: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const DashboardCards = ({
  title,
  link,
  description,
  icon,
  color,
}: CardsProps) => {
  return (
    <Link
      href={link}
      className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
    >
      <div className="p-5">
        <div className="flex items-center ">
          <div className="shrink-0">
            <div
              className={`w-8 h-8 ${color} rounded-md flex items-center justify-center`}
            >
              {icon}
            </div>
          </div>
          <div className=" w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="text-lg font-medium text-gray-900">
                {description}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DashboardCards;
