import Modal from "@/components/file-system/modal";

export default function FileViewModalLayout({ children }: { children: React.ReactNode }) {
    return (
        <Modal>
            <div className="grid grid-rows-file-view-modal h-full w-full xl:rounded-xl bg-zinc-50 dark:bg-zinc-900">{children}</div>
        </Modal>
    );
}
