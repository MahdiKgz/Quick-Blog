"use client";

import React, { useState } from "react";
import { Input } from "@heroui/input";

function SearchModule() {
  const [article, setArticle] = useState("");
  return (
    <Input
      size="lg"
      className="md:w-[430px]"
      label="search Articles"
      variant="flat"
      classNames={{ label: "text-base" }}
      value={article}
      onValueChange={setArticle}
    />
  );
}

export default SearchModule;
