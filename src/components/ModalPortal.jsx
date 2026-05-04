import { createPortal } from 'react-dom'

export default function ModalPortal({ children }) {
  // Use document.body as the portal target to escape transform parents
  return createPortal(children, document.body)
}
