export default function Heading({ title, description }: { title: string; description?: string }) {
    return (
        <div className="mb-8 space-y-0.5">
            <h2 className="text-xl font-bold tracking-tight dark:text-secondary">{title}</h2>
            {description && <p className="dark:text-muted text-sm">{description}</p>}
        </div>
    );
}
