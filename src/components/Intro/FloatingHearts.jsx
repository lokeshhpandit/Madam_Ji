function FloatingHearts() {
  const hearts = [...Array(45)];

  return (
    <>
      {hearts.map((_, i) => (
        <span
          key={i}
          className="floating-heart"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${5 + Math.random() * 5}s`, // Faster (3–6 sec)
            animationDelay: `${Math.random() * 2}s`,
            fontSize: `${40 + Math.random() * 40}px`, // 30–60px
          }}
        >
          ❤️
        </span>
      ))}
    </>
  );
}

export default FloatingHearts;