import { useEffect, useState } from "react";
import supabase from "./suppabase.js";

const classNames = require("classnames");

const CATEGORIES = [
  { name: "technology", color: "bg-sky-700" },
  { name: "science", color: "bg-green-700" },
  { name: "finance", color: "bg-red-700" },
  { name: "society", color: "bg-yellow-700" },
  { name: "entertainment", color: "bg-pink-700" },
  { name: "health", color: "bg-cyan-700" },
  { name: "history", color: "bg-amber-700" },
  { name: "news", color: "bg-purple-700" },
];

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");

  useEffect(
    function () {
      async function getFacts() {
        setIsLoading(true);

        let query = supabase.from("facts").select("*");
        if (currentCategory !== "all") query.eq("category", currentCategory);

        const { data: facts, error } = await query
          .order("votesInteressing", { ascending: false })
          .limit(1000);
        if (!error) setFacts(facts);
        else alert("There was a problem getting data");
        setIsLoading(false);
      }
      getFacts();
    },
    [currentCategory]
  );
  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />
      {showForm ? (
        <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />
      ) : null}
      <main className="xl:grid xl:grid-cols-4 font-mono gap-12 h-[80vh]">
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        {isLoading ? (
          <Loader />
        ) : (
          <FactList setFacts={setFacts} facts={facts} />
        )}
      </main>
    </>
  );
}

function Loader() {
  return (
    <p className="uppercase text-4xl text-center col-span-3  ">Loading...</p>
  );
}

function Header({ showForm, setShowForm }) {
  const appTitle = "Today I Learned";
  return (
    <header className="flex items-center justify-between mb-10">
      <div className="flex gap-4 items-center">
        <img className="h-16 w-16" src="logo.png" alt="logo" />
        <h1 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl text-center font-bold uppercase">
          {appTitle}
        </h1>
      </div>
      <button
        id="btn-open"
        className="lg:text-3xl text-xs md:font-semibold cursor-pointer transition duration-300 hover:scale-110 hover:-rotate-2 border-none py-1 md:py-5 uppercase rounded-2xl md:rounded-full px-2 md:px-12 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 border-2"
        onClick={() => setShowForm((show) => !show)}
      >
        {showForm ? "Close" : "Share a fact"}
      </button>
    </header>
  );
}

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

function NewFactForm({ setFacts, setShowForm }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const textLength = text.length;
  async function handleSubmit(e) {
    // 1. prevent broser reload
    e.preventDefault();

    // 2. check if data is valid. if so, create a new fact
    if (text && isValidHttpUrl(source) && category && textLength <= 200) {
      console.log("There is valid data");
      // create a new fact object
      // const newFact = {
      //   id: initialFacts.length + 1,
      //   text: text,
      //   source: source,
      //   category: category,
      //   votesInteresting: 0,
      //   votesMindblowing: 0,
      //   votesFalse: 0,
      //   createdIn: new Date().getFullYear(),
      // };
      setIsUploading(true);
      const { data: newFact, error } = await supabase
        .from("facts")
        .insert([{ text: text, source: source, category: category }])
        .select();
      setIsUploading(false);
      if (!error) {
        // add the new fact to the ui: add the facy to StaticRange
        setFacts((facts) => [newFact[0], ...facts]);
        // reset input field
        setText("");
        setSource("");
        setCategory("");

        //close the form
        setShowForm(false);
      } else {
        console.log(error);
      }
    }
  }
  return (
    <form
      id="form"
      action=""
      className=" xl:flex-row flex-col flex gap-4 xl:items-center bg-stone-700 rounded-2xl  mb-10 py-4 px-4 md:px-10"
      onSubmit={handleSubmit}
    >
      <input
        className="border-none grow font-mono bg-stone-500 placeholder:text-stone-700 p-4 xl:text-lg rounded-full"
        type="text"
        placeholder="Share a fact with the world...."
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
        disabled={isUploading}
      />
      <span className="font-mono font-semibold text-lg">
        {200 - textLength}
      </span>
      <input
        className="border-none font-mono bg-stone-500 placeholder:text-stone-700 p-4 xl:text-lg rounded-full"
        type="text"
        placeholder="Trustworthy source...."
        value={source}
        onChange={(e) => setSource(e.target.value)}
        disabled={isUploading}
      />
      <select
        className="border-none font-mono bg-stone-500 placeholder:text-stone-700 p-4 xl:text-lg rounded-full"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={isUploading}
      >
        <option value="">Choose category:</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.slice(0, 1).toUpperCase() + cat.name.slice(1)}
          </option>
        ))}
      </select>
      <button className="xl:text-3xl font-semibold cursor-pointer hover:scale-110 border-none py-3 uppercase rounded-full px-12 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 border-2">
        Post
      </button>
    </form>
  );
}

function CategoryFilter({ setCurrentCategory }) {
  return (
    <aside className="mb-10">
      <ul className="xl:space-y-4 flex flex-col gap-2">
        <li>
          <button
            className="xl:text-2xl cursor-pointer transition duration-300 w-full hover:scale-110 hover:-rotate-2 border-none xl:pt-4 xl:pb-3 py-2 uppercase rounded-full px-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 border-2"
            onClick={() => setCurrentCategory("all")}
          >
            All
          </button>
        </li>
        {CATEGORIES.map((category) => (
          <li key={category.name}>
            <button
              onClick={() => setCurrentCategory(category.name)}
              className={classNames(
                "xl:text-2xl cursor-pointer transition duration-300 w-full hover:scale-110 hover:-rotate-2 border-none xl:pt-4 xl:pb-3 py-2 uppercase rounded-full px-4 border-2",
                category.color
              )}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FactList({ facts, setFacts }) {
  if (facts.length === 0)
    return (
      <p className="text-2xl uppercase text-center">
        No facts for this category yet! create the first one 😄
      </p>
    );
  return (
    <section className="col-span-3 overflow-scroll">
      <ul id="facts-list" className="space-y-4">
        {facts.map((fact) => (
          <Fact setFacts={setFacts} key={fact.id} fact={fact} />
        ))}
      </ul>
      <p>There are {facts.length} facts on database. 😄</p>
    </section>
  );
}

function Fact({ fact, setFacts }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isDistuped =
    fact.votesFalse > fact.votesInteressing + fact.votesMindBlowing;
  async function handleVote(columnName) {
    setIsUpdating(true);
    const { data: updateFact, error } = await supabase
      .from("facts")
      .update({ [columnName]: fact[columnName] + 1 })
      .eq("id", fact.id)
      .select();
    setIsUpdating(false);
    if (!error)
      setFacts((facts) =>
        facts.map((f) => (f.id === fact.id ? updateFact[0] : f))
      );
  }
  return (
    <li className="bg-stone-700 rounded-2xl px-6 py-4 grid lg:grid-cols-4 justify-between gap-2 items-center">
      <div className="col-span-3 lg:flex items-center justify-between">
        <p className="xl:text-xl font-mono leading-normal">
          {isDistuped ? (
            <span className="text-xl text-red-500 font-bold mr-4">
              [⛔️DISTUPED]
            </span>
          ) : null}
          {fact.text}
          <a
            className="text-stone-400 hover:text-sky-500    visited:ml-3 duration-300 visited:transition ml-3  transition active:text-sky-500   visited:text-stone-400"
            href={fact.source}
          >
            (source)
          </a>
        </p>
        <span
          id="category"
          className={classNames(
            "text-sm font-bold rounded-full lg:ml-10 uppercase px-2.5 py-1",
            CATEGORIES.find((el) => el.name === fact.category).color
          )}
        >
          #{fact.category}#
        </span>
      </div>
      <div className="flex gap-2 lg:ml-6">
        <button
          onClick={() => handleVote("votesInteressing")}
          disabled={isUpdating}
          className="flex px-3 transition duration-300 disabled:bg-stone-800 hover:bg-stone-600 gap-1 py-1 rounded-full bg-stone-500"
        >
          👍🏻
          <p className="bold">{fact.votesInteressing}</p>
        </button>
        <button
          onClick={() => handleVote("votesMindBlowing")}
          disabled={isUpdating}
          className="flex px-3 transition duration-300 disabled:bg-stone-800 hover:bg-stone-600 gap-1 py-1 rounded-full bg-stone-500"
        >
          🤯
          <p className="bold">{fact.votesMindBlowing}</p>
        </button>

        <button
          onClick={() => handleVote("votesFalse")}
          disabled={isUpdating}
          className="flex px-3 transition duration-300 disabled:bg-stone-800 hover:bg-stone-600 gap-1 py-1 rounded-full bg-stone-500"
        >
          ⛔️
          <p className="bold">{fact.votesFalse}</p>
        </button>
      </div>
    </li>
  );
}
export default App;
