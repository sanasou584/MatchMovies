import { UserProfile } from "../../../types/movie";

export interface MatchedUser extends UserProfile {
  matchRate: number;
  sharedMovieTitles: string[];
}

export const MATCH_THRESHOLD = 75;

export const computeMatches = (
  users: UserProfile[],
  myLikes: string[],
  movieTitles: Record<string, string>,
  currentUserId: string
): MatchedUser[] => {
  const myLikesSet = new Set(myLikes);
  const matches: MatchedUser[] = [];

  if (myLikesSet.size === 0) return [];

  const myVectorNorm = Math.sqrt(myLikesSet.size);

  users.forEach((user) => {
    if (user.id === currentUserId) return;
    if (user.disabled === true) return;

    const theirLikes = user.liked_movies ?? [];
    if (theirLikes.length === 0) return;

    const theirLikesSet = new Set(theirLikes);
    const shared = [...theirLikesSet].filter((id) => myLikesSet.has(id));

    // Binary preference vectors: cosine = dot / (||a|| * ||b||)
    const dotProduct = shared.length;
    const theirVectorNorm = Math.sqrt(theirLikesSet.size);
    const rate =
      dotProduct > 0 ? (dotProduct / (myVectorNorm * theirVectorNorm)) * 100 : 0;
    const roundedRate = Math.round(rate);

    // Preference match strictly exceeds threshold
    if (roundedRate >= MATCH_THRESHOLD) {
      matches.push({
        ...user,
        matchRate: roundedRate,
        sharedMovieTitles: shared.map((id) => movieTitles[id] || "Unknown Movie"),
      });
    }
  });

  return matches.sort((a, b) => b.matchRate - a.matchRate);
};
