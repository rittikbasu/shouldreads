export const sortResultsByFilter = (results, selectedFilter) => {
  return results.sort((a, b) => {
    switch (selectedFilter) {
      case "mentions":
        return b.mentions - a.mentions;
      case "likes":
        return b.likes - a.likes;
      case "comments":
        return b.comments - a.comments;
      case "impressions":
        return b.impressions - a.impressions;
      case "ratings":
        return Number(b.ratings) - Number(a.ratings);
      case "topAuthors":
        return (
          b.author_mentions - a.author_mentions ||
          b.author_books - a.author_books
        );
      default:
        return 0;
    }
  });
};
