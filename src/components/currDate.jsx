import React, { useState, useEffect } from "react";

const formatDate = (date) => {
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear().toString().slice(-2);
  return `${day} ${month} '${year}`;
};

const CurrentDate = () => {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const now = new Date();
    setCurrentDate(formatDate(now));
  }, []);

  return (
    <div>
      <p>{currentDate}</p>
    </div>
  );
};

export default CurrentDate;
