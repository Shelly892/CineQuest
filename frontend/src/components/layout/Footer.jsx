export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#141118] text-white border-t border-[#302839] mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-sm text-[#ab9cba]">
          <p>&copy; {currentYear} CineQuest - Powered by Microservices</p>
        </div>
      </div>
    </footer>
  );
}
