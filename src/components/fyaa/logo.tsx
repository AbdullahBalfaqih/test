import Image from 'next/image';

export function Logo(props: { className?: string }) {
    return (
        <Image
            src="/logo.png"
            alt="شعار فيه (Fyaa)"
            width={200}
            height={100}
            className={props.className}
            priority
        />
    );
}
