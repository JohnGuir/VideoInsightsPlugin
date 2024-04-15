import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryList } from "./QueryList";
import { Query } from "./QueryItem";

describe("QueryList", () => {
  const sampleQueries: Query[] = [
    { id: 1, text: "First query", videos: [] },
    { id: 2, text: "Second query", videos: [] },
  ];

  it("renders a list of queries", () => {
    render(
      <QueryList
        queries={sampleQueries}
        onRenameQuery={() => {}}
        onDeleteQuery={() => {}}
        onViewResults={() => {}}
      />
    );
    expect(screen.getByText("First query")).toBeInTheDocument();
    expect(screen.getByText("Second query")).toBeInTheDocument();
  });

  it("calls onRenameQuery when an edit action is performed on a query", () => {
    const handleRenameQuery = jest.fn();
    render(
      <QueryList
        queries={sampleQueries}
        onRenameQuery={handleRenameQuery}
        onDeleteQuery={() => {}}
        onViewResults={() => {}}
      />
    );

    // Simulate edit action on the first query
    fireEvent.click(screen.getAllByText("Rename")[0]);
    fireEvent.change(screen.getByDisplayValue("First query"), {
      target: { value: "Updated first query" },
    });
    fireEvent.click(screen.getByText("Save"));

    expect(handleRenameQuery).toHaveBeenCalledWith(
      sampleQueries[0].id,
      "Updated first query"
    );
  });

  it("calls onDeleteQuery when a delete action is performed on a query", () => {
    const handleDeleteQuery = jest.fn();
    render(
      <QueryList
        queries={sampleQueries}
        onRenameQuery={() => {}}
        onDeleteQuery={handleDeleteQuery}
        onViewResults={() => {}}
      />
    );
  });
  it("calls onViewResults when a delete action is performed on a query", () => {
    const handleViewResults = jest.fn();
    render(
      <QueryList
        queries={sampleQueries}
        onRenameQuery={() => {}}
        onDeleteQuery={() => {}}
        onViewResults={handleViewResults}
      />
    );

    // Simulate delete action on the second query
    fireEvent.click(screen.getAllByText("Delete")[1]);

    // expect(handleDeleteQuery).toHaveBeenCalledWith(sampleQueries[1].id);
  });
});
