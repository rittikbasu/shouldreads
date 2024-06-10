export const GradientIcon = ({
  IconComponent,
  gradientId = "icon-gradient",
  svgClassName,
  iconClassName,
  viewBox,
  selected = false,
}) => {
  return (
    <svg className={svgClassName} viewBox={viewBox}>
      <defs>
        {selected ? (
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6FC6FF" />
            <stop offset="100%" stopColor="#4285F4" />
          </linearGradient>
        ) : (
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E5E7EB" />
            <stop offset="100%" stopColor="#9CA3AF" />
          </linearGradient>
        )}
      </defs>
      <IconComponent fill={`url(#${gradientId})`} className={iconClassName} />
    </svg>
  );
};
