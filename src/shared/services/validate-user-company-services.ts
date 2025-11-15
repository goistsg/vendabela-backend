import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { UserCompany } from "@prisma/client";

@Injectable()
export class ValidateCompanyAccessService {
    private readonly logger = new Logger(ValidateCompanyAccessService.name);

    constructor(private readonly prisma: PrismaService) {}

    async validateAccessToCompany(companyId: string, userId: string): Promise<UserCompany | null> {
        const company = await this.prisma.company.findUnique({
        where: { id: companyId },
        });

        if (!company) {
            this.logger.error(`Empresa com ID ${companyId} não encontrada`);
            return null;
        }

        const userCompany = await this.prisma.userCompany.findUnique({
            where: {
            userId_companyId: {
                userId,
                companyId,
            },
            },
        });

        if (!userCompany) {
            this.logger.error(`Usuário ${userId} não tem acesso a empresa ${companyId}`);
            return null;
        }
        return userCompany;
    }
}