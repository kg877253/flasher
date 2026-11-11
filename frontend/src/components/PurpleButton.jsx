import SpecularButton from "./SpecularButton";

// The purple SpecularButton used for the main action of a page
export default function PurpleButton({ children, onClick }) {
  return (
    <SpecularButton
      size="lg"
      radius={999}
      tint="#a855f7"
      tintOpacity={0.85}
      baseColor="#d8b4fe"
      lineColor="#ffffff"
      idleIntensity={0.45}
      shineSize={12}
      followMouse
      proximity={250}
      onClick={onClick}
    >
      <span className="inline-flex items-center gap-2">{children}</span>
    </SpecularButton>
  );
}