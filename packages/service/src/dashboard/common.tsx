import type { FC } from "hono/jsx";

export const Header: FC = () => {
  return (
    <div class="navbar bg-base-100 shadow-sm">
      <a class="btn btn-ghost text-xl" href="/">
        🐦 Chickadee
      </a>
    </div>
  );
};

export const Footer: FC = () => {
  const url = "https://github.com/abegehr/chickadee";

  return (
    <footer class="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4">
      <aside>
        <p>
          🐦 Chickadee -{" "}
          <a href={url} class="link">
            abegehr/chickadee
          </a>
        </p>
      </aside>
    </footer>
  );
};
