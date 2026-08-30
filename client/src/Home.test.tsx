import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import Home from "./Home";

describe("Home", () => {
  test("hero タイトルとセクション見出しが表示される", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: "yuniruyuni.net" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "ゆにるユニ" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "🌟これまでに配信で作ったもの🌟" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "📚二次創作・ファンアートについて" }),
    ).toBeInTheDocument();
  });

  test("#content の main 要素が存在する", () => {
    const { container } = render(<Home />);
    const content = container.querySelector("#content");
    expect(content).not.toBeNull();
  });

  test("配信で作ったものの各カードに画像が表示される", () => {
    render(<Home />);
    const images = screen
      .getAllByRole("img")
      .filter((img) => img.getAttribute("src")?.startsWith("/product-"));
    expect(images).toHaveLength(10);
    for (const img of images) {
      expect(img).toHaveAccessibleName();
    }
  });

  test("Fighter Notes へのリンクが表示される", () => {
    render(<Home />);
    expect(screen.getByRole("link", { name: /Fighter Notes/ })).toHaveAttribute(
      "href",
      "https://fighter.yuniruyuni.net/",
    );
  });
});
