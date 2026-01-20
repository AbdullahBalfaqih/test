'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Logo } from './logo';

export function PrivacyPolicy() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="underline underline-offset-4 hover:text-primary p-0 h-auto bg-transparent">
          سياسة الخصوصية
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle className="mb-4">
            سياسة الخصوصية لنظام المرفقات السحابي - Fyaa Cloud
          </DialogTitle>
        </DialogHeader>
        <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Logo className="w-64 h-auto opacity-5" />
            </div>
            <ScrollArea className="h-[60vh] p-4 border rounded-md text-right">
            <div className="space-y-4">
                <div>
                <h3 className="font-bold text-lg mb-2">المقدمة:</h3>
                <p className="text-sm text-muted-foreground">
                    نلتزم في Fyaa Cloud بحماية خصوصية المستخدمين والحفاظ على سرية
                    البيانات والمرفقات التي يتم التعامل معها عبر النظام. تم تصميم
                    النظام ليكون آمنًا، منظمًا، وقابلًا للاستخدام المؤسسي، مع
                    مراعاة أفضل الممارسات في حماية البيانات.
                </p>
                </div>

                <div>
                <h3 className="font-bold text-lg mb-2">
                    أولاً: البيانات التي يتم جمعها
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                    قد يقوم النظام بجمع ومعالجة البيانات التالية:
                </p>
                <ul className="list-disc pr-6 text-sm text-muted-foreground space-y-1">
                    <li>
                    المرفقات التي يرفعها المستخدم (مثل: ملفات PDF، صور، مستندات).
                    </li>
                    <li>
                    بيانات تشغيلية مرتبطة بالمرفق، مثل:
                    <ul className="list-decimal pr-6 mt-1 space-y-1">
                        <li>نوع الملف</li>
                        <li>تاريخ ووقت الرفع</li>
                        <li>ارتباط المرفق بالطلب أو الخدمة</li>
                    </ul>
                    </li>
                </ul>
                <p className="text-sm text-muted-foreground mt-2">
                    لا يقوم النظام بجمع بيانات غير لازمة لتشغيله أو خارج نطاق إدارة
                    المرفقات.
                </p>
                </div>

                <div>
                <h3 className="font-bold text-lg mb-2">
                    ثانياً: كيفية استخدام البيانات
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                    تُستخدم البيانات والمرفقات للأغراض التالية:
                </p>
                <ul className="list-disc pr-6 text-sm text-muted-foreground space-y-1">
                    <li>عرض المرفقات داخل النظام بشكل مباشر (Inline View).</li>
                    <li>
                    تنظيم المرفقات وربطها بالطلبات أو العمليات ذات العلاقة.
                    </li>
                    <li>تحسين أداء النظام وتجربة المستخدم.</li>
                    <li>الحفاظ على استمرارية الخدمة وسلامة البيانات.</li>
                </ul>
                </div>

                <div>
                <h3 className="font-bold text-lg mb-2">
                  ثالثاً: الوصول إلى البيانات والصلاحيات
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                    يتم الوصول إلى المرفقات والبيانات وفق نظام صلاحيات واضح، يشمل:
                </p>
                <ul className="list-disc pr-6 text-sm text-muted-foreground space-y-1">
                    <li>المستخدم: الاطلاع على مرفقاته فقط.</li>
                    <li>
                    الموظف: الاطلاع على المرفقات المرتبطة بالمهام أو الطلبات
                    المصرح له بها.
                    </li>
                    <li>المشرف: الاطلاع على المرفقات لأغراض إدارية أو تشغيلية.</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-2">
                    يتم تقييد الوصول إلى البيانات بالحد الأدنى اللازم لتنفيذ المهام.
                </p>
                </div>

                <div>
                <h3 className="font-bold text-lg mb-2">رابعاً: حماية البيانات</h3>
                <p className="text-sm text-muted-foreground mb-2">
                    يعتمد النظام على مجموعة من الإجراءات التقنية والتنظيمية لحماية
                    البيانات، من أبرزها:
                </p>
                <ul className="list-disc pr-6 text-sm text-muted-foreground space-y-1">
                    <li>عرض المرفقات داخل النظام دون الحاجة إلى تنزيلها.</li>
                    <li>ضغط ملفات PDF لتقليل الاعتماد على مصادر خارجية.</li>
                    <li>
                    تنظيم المرفقات داخل حاويات واضحة تقلل من التداول غير المنضبط.
                    </li>
                    <li>الفصل بين نظام التخزين وباقي مكونات النظام.</li>
                </ul>
                </div>

                <div>
                <h3 className="font-bold text-lg mb-2">
                    خامساً: مشاركة البيانات
                </h3>
                <ul className="list-disc pr-6 text-sm text-muted-foreground space-y-1">
                    <li>
                    لا يتم مشاركة المرفقات أو البيانات مع أطراف خارجية دون مبرر
                    نظامي أو قانوني.
                    </li>
                    <li>
                    لا يتم استخدام البيانات لأغراض تسويقية أو غير متعلقة بتشغيل
                    النظام.
                    </li>
                </ul>
                </div>

                <div>
                <h3 className="font-bold text-lg mb-2">سادساً: حقوق المستخدم</h3>
                <p className="text-sm text-muted-foreground mb-2">
                    يتمتع المستخدم بالحقوق التالية:
                </p>
                <ul className="list-disc pr-6 text-sm text-muted-foreground space-y-1">
                    <li>الاطلاع على مرفقاته داخل النظام.</li>
                    <li>طلب حذف المرفقات وفق السياسات المعتمدة.</li>
                    <li>معرفة كيفية استخدام بياناته داخل النظام.</li>
                </ul>
                </div>
            </div>
            </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
